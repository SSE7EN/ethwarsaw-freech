export class UserComment {
    constructor(commentId: number, walletAddress: string, content: string, likes: number, dislikes: number) {
        this.commentId = commentId;
        this.walletAddress = walletAddress;
        this.content = content;
        this.likes = likes;
        this.dislikes = dislikes;
    }
    commentId: number;
    walletAddress: string;
    content: string;
    likes: number;
    dislikes: number;



}