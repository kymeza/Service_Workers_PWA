using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using simple_pwa_app_backend.Model.Config;
using WebPush;

namespace simple_pwa_app_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PWAController : ControllerBase
    {
        private readonly VapidSettings _vapidSettings;

        public PWAController(IOptions<VapidSettings> vapidSettings)
        {
            _vapidSettings = vapidSettings.Value;
        }

        [HttpPost("sendNotification")]
        public IActionResult SendNotification([FromBody] PushSubscription sub)
        {
            if (sub == null || string.IsNullOrEmpty(sub.Endpoint) || sub.Keys == null || !sub.Keys.ContainsKey("p256dh") || !sub.Keys.ContainsKey("auth"))
            {
                return BadRequest("Invalid push subscription format.");
            }

            var pushClient = new WebPushClient();
            var vapidDetails = new VapidDetails(_vapidSettings.Subject, _vapidSettings.PublicKey, _vapidSettings.PrivateKey);

            var pushSubscription = new WebPush.PushSubscription(sub.Endpoint, sub.Keys["p256dh"], sub.Keys["auth"]);
            var payload = new
            {
                notification = new
                {
                    title = "Test Notification",
                    body = "ESTE ES UN MENSAJE DE NOTIFICACION DE PRUEBA",
                    icon = "assets/icons/icon-96x96.png"
                }
            };

            var jsonPayload = JsonConvert.SerializeObject(payload);

            try
            {
                pushClient.SendNotification(pushSubscription, jsonPayload, vapidDetails);
                return Ok();
            }
            catch (WebPushException ex)
            {
                return StatusCode(500, "Failed to send notification.");
            }
        }

    }

    public class PushSubscription
    {
        public string Endpoint { get; set; }
        public Dictionary<string, string> Keys { get; set; }
    }

}
