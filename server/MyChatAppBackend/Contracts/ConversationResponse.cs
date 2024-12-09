namespace MyChatAppBackend.Contracts;

public class ConversationResponse
{
    public int ConversationId { get; set; } // The ID of the conversation
    public string User1Id { get; set; } // The ID of the user who initiated the conversation
    public string User1UserName { get; set; } 
    public string User2Id { get; set; } // The ID of the other user in the conversation
    public string User2UserName { get; set; } // The username of the other user
}