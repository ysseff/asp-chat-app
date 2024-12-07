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
        public async Task<Conversation?> StartConversationAsync(string user1Id, string user2Id, CancellationToken cancellationToken = default)
        {
            var existing = await dbContext.Conversations
                .FirstOrDefaultAsync(c =>
                    (c.User1Id == user1Id && c.User2Id == user2Id) ||
                    (c.User1Id == user2Id && c.User2Id == user1Id), cancellationToken: cancellationToken);

            if (existing != null) return existing;

            var conversation = new Conversation { User1Id = user1Id, User2Id = user2Id };
            dbContext.Conversations.Add(conversation);
            await dbContext.SaveChangesAsync(cancellationToken);
            return conversation;
        }

        public async Task<Conversation?> StartConversationAsync(string user1Id, StartConversationRequest request, CancellationToken cancellationToken = default)
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

        public async Task<List<Conversation>> GetUserConversationsAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Conversations
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .Include(c => c.Messages)
                .ToListAsync(cancellationToken: cancellationToken);
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
    }
}