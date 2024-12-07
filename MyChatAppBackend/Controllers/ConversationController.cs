using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Entities;
using MyChatAppBackend.Services;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConversationsController : ControllerBase
    {
        private readonly IConversationService _conversationService;

        public ConversationsController(IConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var conversation = await _conversationService.StartConversationAsync(userId, request, cancellationToken);
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
            var conversations = await _conversationService.GetUserConversationsAsync(userId, cancellationToken);
            return Ok(conversations);
        }

        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetConversation(int conversationId, CancellationToken cancellationToken)
        {
            var conversation = await _conversationService.GetConversationByIdAsync(conversationId, cancellationToken);
            if (conversation == null) return BadRequest();
            return Ok(conversation);
        }
        
        [HttpDelete("{conversationId}")]
        public async Task<IActionResult> DeleteConversation(int conversationId, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var deleted = await _conversationService.DeleteConversationAsync(conversationId, userId, cancellationToken);
            if (!deleted)
                return BadRequest("Conversation not found or you are not authorized to delete it.");
    
            return NoContent();
        }
    }
}

