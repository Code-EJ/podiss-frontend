/** Backend HTTP contracts; Portuguese keys are intentional wire names. @author oEnzoRibas */
export interface Episode {
  id: string; youtubeId: string; videoUrl: string; title: string; description: string;
  thumbnailUrl: string | null; createdAt: string;
}
/** Published post metadata; image bytes are fetched separately. @author oEnzoRibas */
export interface Post {
  id: string; title: string; description: string; tags: string; createdAt: string;
  hasImage: boolean; imageUrl: string | null;
}
/** English domain vocabulary; HTTP uses ContactResponse instead. @author oEnzoRibas */
export interface ContactMessage {
  id: string; senderName: string; email: string; subject: string; message: string; createdAt: string;
}
/** English domain vocabulary; HTTP uses SuggestionResponse instead. @author oEnzoRibas */
export interface TopicSuggestion {
  id: string; senderName: string; email: string; topic: string; createdAt: string;
}
/** Public contact submission; preserve these wire keys. @author oEnzoRibas */
export interface ContactPayload { nome: string; email: string; assunto: string; mensagem: string }
/** Public topic submission; preserve these wire keys. @author oEnzoRibas */
export interface SuggestionPayload { nome: string; email: string; tema: string }
/** Administrator-only contact representation. @author oEnzoRibas */
export interface ContactResponse extends ContactPayload { id: string; createdAt: string }
/** Administrator-only suggestion representation. @author oEnzoRibas */
export interface SuggestionResponse extends SuggestionPayload { id: string; createdAt: string }
/** Optional problem-detail fields; transport errors may not contain JSON. @author oEnzoRibas */
export interface ApiProblem { detail?: string; title?: string; status?: number }
