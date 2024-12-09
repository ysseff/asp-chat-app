namespace MyChatAppBackend.Contracts
{
    public class MessageResponse
    {
        public int ConversationId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

    }
}