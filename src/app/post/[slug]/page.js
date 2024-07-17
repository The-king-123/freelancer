// app/post/[slug]/page.js
import { notFound } from 'next/navigation';
import PostContent from '../../../components/PostContent';
import { fetchPosts, fetchPostData } from '../../../lib/posts';

export async function generateStaticParams() {
  try {
    const posts = await fetchPosts();
    if (!Array.isArray(posts)) {
      throw new Error('fetchPosts did not return an array');
    }
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Ensure it returns an array
  }
}

export async function generateMetadata({ params }) {
  try {
    const post = await fetchPostData(params.slug);
    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }
    return {
      title: post.title,
    };
  } catch (error) {
    console.error(`Error generating metadata for slug ${params.slug}:`, error);
    return {
      title: 'Error',
    };
  }
}

export default async function PostPage({ params }) {
  try {
    const post = await fetchPostData(params.slug);
    if (!post) {
      notFound();
    }
    return (
      <div>
        <h1>{post.title}</h1>
        <PostContent content={post.content} />
      </div>
    );
  } catch (error) {
    console.error(`Error rendering page for slug ${params.slug}:`, error);
    return (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the post. Please try again later.</p>
      </div>
    );
  }
}
