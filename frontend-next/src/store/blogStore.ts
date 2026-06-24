import { create } from "zustand";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  createdAt?: string;
};

type BlogState = {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<Blog | null>;
};

const BLOGS_API = "http://localhost:8000/blog";

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(BLOGS_API);
      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch blogs" });
        return;
      }

      const data = (await response.json()) as Blog[];
      set({ blogs: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false, error: "Failed to fetch blogs" });
    }
  },

  fetchBlogBySlug: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BLOGS_API}/post/${slug}`);
      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch blog details" });
        return null;
      }
      const data = (await response.json()) as Blog;
      set({ loading: false });
      return data;
    } catch {
      set({ loading: false, error: "Failed to fetch blog details" });
      return null;
    }
  },
}));