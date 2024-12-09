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
        public async Task<ConversationResponse?> StartConversationAsync(string user1Id, string user1UserName, string user2Id, CancellationToken cancellationToken = default)
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
            return await MapToConversationResponse(conversation, user1Id, user1UserName, cancellationToken);
        }

        public async Task<ConversationResponse?> StartConversationAsync(string user1Id, string user1UserName, StartConversationRequest request, CancellationToken cancellationToken = default)
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

            return await StartConversationAsync(user1Id, user1UserName,  otherUser.Id, cancellationToken);
        }

        public async Task<List<ConversationResponse>> GetUserConversationsAsync(string userId, string userName, CancellationToken cancellationToken = default)
        {
            var conversations = await dbContext.Conversations
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .ToListAsync(cancellationToken);

            var conversationResponses = new List<ConversationResponse>();

            foreach (var conversation in conversations)
            {
                // Determine the other user in the conversation
                var otherUserId = conversation.User1Id == userId ? conversation.User2Id : conversation.User1Id;
                var otherUser = await userManager.FindByIdAsync(otherUserId);

                if (otherUser != null)
                {
                    conversationResponses.Add(new ConversationResponse
                    {
                        ConversationId = conversation.Id,
                        User1Id = userId,
                        User1UserName = userName,
                        User2Id = otherUser.Id,
                        User2UserName = otherUser.UserName!
                    });
                }
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
        private async Task<ConversationResponse?> MapToConversationResponse(Conversation conversation, string currentUserId, string currentUserName, CancellationToken cancellationToken)
        {
            var otherUserId = conversation.User1Id == currentUserId ? conversation.User2Id : conversation.User1Id;

            var otherUser = await userManager.FindByIdAsync(otherUserId);
            if (otherUser == null) return null;

            return new ConversationResponse
            {
                ConversationId = conversation.Id,
                User1Id = currentUserId,
                User1UserName = currentUserName,
                User2Id = otherUser.Id,
                User2UserName = otherUser.UserName!
            };
        }
    }
}