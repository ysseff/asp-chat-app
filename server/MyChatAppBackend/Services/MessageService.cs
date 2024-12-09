using Microsoft.EntityFrameworkCore;
using MyChatAppBackend.Entities;
using MyChatAppBackend.Persistence;

namespace MyChatAppBackend.Services
{
    public class MessageService(ApplicationDbContext dbContext) : IMessageService
    {
        public async Task<Message> SendMessageAsync(int conversationId, string senderId, string content, CancellationToken cancellationToken = default)
        {
            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content,
                Timestamp = DateTime.UtcNow
            };

            dbContext.Messages.Add(message);
            await dbContext.SaveChangesAsync(cancellationToken);
            return message;
        }

        public async Task<List<Message>> GetMessagesForConversationAsync(int conversationId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync(cancellationToken);
        }
    }
}