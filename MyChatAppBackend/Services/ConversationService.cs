using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Entities;
using MyChatAppBackend.Persistence;

namespace MyChatAppBackend.Services
{
    public class ConversationService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        : IConversationService
    {
        public async Task<ConversationResponse?> StartConversationAsync(string user1Id, string user2Id, CancellationToken cancellationToken = default)
        {
            if (user1Id == user2Id) return null;
            
            var existing = await dbContext.Conversations
                .FirstOrDefaultAsync(c =>
                    (c.User1Id == user1Id && c.User2Id == user2Id) ||
                    (c.User1Id == user2Id && c.User2Id == user1Id), cancellationToken: cancellationToken);

            if (existing != null) return null;

            var conversation = new Conversation { User1Id = user1Id, User2Id = user2Id };
            dbContext.Conversations.Add(conversation);
            await dbContext.SaveChangesAsync(cancellationToken);
            return await MapToConversationResponse(conversation, user1Id, cancellationToken);
        }

        public async Task<ConversationResponse?> StartConversationAsync(string user1Id, StartConversationRequest request, CancellationToken cancellationToken = default)
        {
            // Find the other user by email or username
            ApplicationUser? otherUser = null;

            if (!string.IsNullOrEmpty(request.Email))
            {
                otherUser = await userManager.FindByEmailAsync(request.Email);
            }

            if (otherUser == null && !string.IsNullOrEmpty(request.Username))
            {
                otherUser = await userManager.FindByNameAsync(request.Username);
            }

            if (otherUser == null)
            {
                return null;
            }

            return await StartConversationAsync(user1Id, otherUser.Id, cancellationToken);
        }

        public async Task<List<ConversationResponse>> GetUserConversationsAsync(string userId, CancellationToken cancellationToken = default)
        {
            var conversations = await dbContext.Conversations
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .ToListAsync(cancellationToken);

            var conversationResponses = new List<ConversationResponse>();

            foreach (var conversation in conversations)
            {
                var response = await MapToConversationResponse(conversation, userId, cancellationToken);
                if (response != null)
                    conversationResponses.Add(response);
            }

            return conversationResponses;
        }

        public async Task<Conversation> GetConversationByIdAsync(int conversationId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Conversations
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken: cancellationToken);
        }

        public async Task<bool> DeleteConversationAsync(int conversationId, string userId, CancellationToken cancellationToken = default)
        {
            // Fetch the conversation
            var conversation = await dbContext.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

            if (conversation == null)
                return false; // Conversation does not exist

            // Check if the user is part of the conversation
            if (conversation.User1Id != userId && conversation.User2Id != userId)
                return false;

            // Delete the conversation
            dbContext.Conversations.Remove(conversation);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        private async Task<ConversationResponse?> MapToConversationResponse(Conversation conversation, string currentUserId, CancellationToken cancellationToken)
        {
            var user1 = await userManager.FindByIdAsync(conversation.User1Id);
            var user2 = await userManager.FindByIdAsync(conversation.User2Id);
            if (user1 == null || user2 == null) return null;

            return new ConversationResponse
            {
                ConversationId = conversation.Id,
                User1Id = user1.Id,
                User1Username = user1.UserName,
                User2Id = user2.Id,
                User2Username = user2.UserName
            };
        }
        
        
    }
    
    
}