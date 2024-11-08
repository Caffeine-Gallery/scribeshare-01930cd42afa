import { backend } from "declarations/backend";

let posts = [];

// Show/hide loading spinner
const toggleLoading = (show) => {
    document.getElementById('loading').classList.toggle('d-none', !show);
};

// Format date
const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
};

// Render all posts
const renderPosts = () => {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = posts
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        .map(post => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                    <p class="card-text"><small class="text-muted">Posted on: ${formatDate(post.timestamp)}</small></p>
                    <button class="btn btn-danger btn-sm" onclick="window.deletePost(${post.id})">Delete</button>
                </div>
            </div>
        `)
        .join('');
};

// Load all posts
const loadPosts = async () => {
    toggleLoading(true);
    try {
        posts = await backend.getAllPosts();
        renderPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
    } finally {
        toggleLoading(false);
    }
};

// Create new post
const createPost = async (event) => {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    toggleLoading(true);
    try {
        await backend.createPost(title, content);
        document.getElementById('createPostForm').reset();
        await loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
    } finally {
        toggleLoading(false);
    }
};

// Delete post
window.deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    toggleLoading(true);
    try {
        await backend.deletePost(id);
        await loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    } finally {
        toggleLoading(false);
    }
};

// Event listeners
document.getElementById('createPostForm').addEventListener('submit', createPost);

// Initial load
loadPosts();
