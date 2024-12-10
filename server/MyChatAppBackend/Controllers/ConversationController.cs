using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Entities;
using MyChatAppBackend.Hubs;
using MyChatAppBackend.Services;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConversationsController(IConversationService conversationService) : ControllerBase
    {
        [HttpPost("start")]
        public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request, [FromServices] IHubContext<ChatHub> hubContext,CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Claims.FirstOrDefault(c => c.Type == "username").Value;

            try
            {
                var conversation = await conversationService.StartConversationAsync(userId, userName, request, cancellationToken);
                if (conversation == null)
                {
                    return BadRequest("User not found");
                }
                var otherUserId = conversation.User1Id == userId ? conversation.User2Id : conversation.User1Id;
                await hubContext.Clients.User(otherUserId)
                    .SendAsync("ReceiveNewConversation", conversation, cancellationToken);
                return Ok(conversation);
            }
            catch (KeyNotFoundException)
            {
                return BadRequest("User not found");
            }
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyConversations(CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Claims.FirstOrDefault(c => c.Type == "username").Value;
            var conversations = await conversationService.GetUserConversationsAsync(userId, userName, cancellationToken);
            return Ok(conversations);
        }

        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetConversation(int conversationId, CancellationToken cancellationToken)
        {
            var conversation = await conversationService.GetConversationByIdAsync(conversationId, cancellationToken);
            if (conversation == null) return BadRequest();
            return Ok(conversation);
        }
        
        [HttpDelete("{conversationId}")]
        public async Task<IActionResult> DeleteConversation(int conversationId, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var deleted = await conversationService.DeleteConversationAsync(conversationId, userId!, cancellationToken);
            if (!deleted)
                return BadRequest("Conversation not found or you are not authorized to delete it.");
    
            return NoContent();
        }
    }
}

