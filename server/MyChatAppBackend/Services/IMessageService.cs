// Services/IMessageService.cs
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Services
{
    public interface IMessageService
    {
        Task<Message> SendMessageAsync(int conversationId, string senderId, string content, CancellationToken cancellationToken = default);
        Task<List<Message>> GetMessagesForConversationAsync(int conversationId, CancellationToken cancellationToken = default);
    }
}