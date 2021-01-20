interface IExpWeek {
  num_comments: number;
  num_posts: number;
  num_liked_posts: number;
  num_liked_comments: number;
}

const expTable = {
  v1: {
    post: 500,
    comment: 100,
    postLike: 25,
    commentLike: 10
  }
}
export default expTable

export function calcWeekExp ({
  num_comments,
  num_liked_comments,
  num_liked_posts,
  num_posts
}: IExpWeek): number {
  const expBase = expTable.v1
  const expComments = num_comments * expBase.comment
  const expPost = num_posts * expBase.post
  const expLikes = num_liked_comments * expBase.commentLike +
    num_liked_posts * expBase.postLike

  return expComments + expPost + expLikes
}
