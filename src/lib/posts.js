// lib/posts.js
export async function fetchPosts() {
  try {
    // Simulated data fetching
    const posts = [
      { slug: 'first-post', title: 'First Post', content: 'This is the first post.' },
      { slug: 'second-post', title: 'Second Post', content: 'This is the second post.' },
      { slug: 'actuality-form-the-reality-of-virtuality', title: 'Actuality Form: The Reality of Virtuality', content: 'This is the content for the actuality post.' },
    ];
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Ensure it returns an array
  }
}

export async function fetchPostData(slug) {
  try {
    const posts = await fetchPosts();
    const post = posts.find(post => post.slug === slug);
    return post || null; // Ensure it returns null if not found
  } catch (error) {
    console.error(`Error fetching post data for slug ${slug}:`, error);
    return null; // Ensure it returns null if there's an error
  }
}
