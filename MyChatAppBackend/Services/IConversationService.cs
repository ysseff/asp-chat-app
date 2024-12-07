using System.Collections.Generic;
using System.Threading.Tasks;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Services
{
    public interface IConversationService
    {
        Task<ConversationResponse?> StartConversationAsync(string user1Id, string user2Id, CancellationToken cancellationToken = default);
        Task<ConversationResponse?> StartConversationAsync(string user1Id, StartConversationRequest request, CancellationToken cancellationToken = default);
        Task<List<ConversationResponse>> GetUserConversationsAsync(string userId, CancellationToken cancellationToken = default);
        Task<Conversation?> GetConversationByIdAsync(int conversationId, CancellationToken cancellationToken = default);
        Task<bool> DeleteConversationAsync(int conversationId, string userId, CancellationToken cancellationToken = default);
    }
}