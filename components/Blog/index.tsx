"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import { apiRequest } from "@/utils/apiRequest";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/Common/CustomTable";
import { AddBlogCategoryModal } from "./Category/AddBlogCategory";

const Blog = () => {
  const headers = [
    { label: "Image", key: "image" },
    { label: "Id", key: "id" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
  ];

  const [blog, setBlog] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [blogCategoryData, setBlogCategoryData] = useState({
    title: "",
    desc: "",
    image: null as File | null,
  });

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/v1/admin/allBlogForAdmin`, "GET");
      if (data?.status === 200) {
        const articlesArray = data?.data?.docs || [];

        const formattedData = articlesArray.map((article: any) => ({
          id: article?._id,
          image: article.image,
          title: article.title,
          description: article.description,
        }));

        setBlog(formattedData);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false); // Reset loading when the request is done
    }
  }, []);

  console.log("This is blog", blog);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);
  const handleSave = useCallback(async () => {
    try {
      if (!blogCategoryData.title || !blogCategoryData.desc) {
        console.log("Missing data:", blogCategoryData);
        return;
      }
      setLoading(true);
      // Create FormData to send data and image
      const formData = new FormData();
      formData.append("title", blogCategoryData.title);
      formData.append("description", blogCategoryData.desc);

      if (
        blogCategoryData.image &&
        typeof blogCategoryData.image !== "string"
      ) {
        formData.append("image", blogCategoryData.image);
      }

      let response;

      if (isEditMode && selectedArticle?.id) {
        response = await apiRequest(
          `/api/v1/admin/updateBlog/${selectedArticle.id}`,
          "PUT",
          formData
        );
      } else {
        response = await apiRequest(
          "/api/v1/admin/createBlogPage",
          "POST",
          formData
        );
      }

      if (response) {
        setBlogCategoryData({
          title: "",
          desc: "",
          image: null,
        });
        setIsEditMode(false);
        setOpenModal(false);
        fetchBlog();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
    }
  }, [blogCategoryData, isEditMode, selectedArticle, fetchBlog]);

  const handleEdit = useCallback((data: any) => {
    setSelectedArticle(data);
    console.log("This is edit data", data);
    setBlogCategoryData({
      title: data.title,
      desc: data.description,
      image: null,
    });
    setIsEditMode(true);
    setOpenModal(true);
  }, []);

  const deleteBlog = useCallback(
    async (id: any) => {
      try {
        setLoading(true);
        const response = await apiRequest(
          `/api/v1/admin/deleteBlog/${id}`,
          "DELETE"
        );
        if (response) {
          fetchBlog();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchBlog]
  );

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[28px] font-semibold text-[#202224]">Blog</div>

        <div className="flex gap-2 ">
          <div>
            <Button
              onClick={() => setOpenModal(true)}
              variant={"default"}
              icon={<PlusIcon className="size-4" />}
            >
              Add new blog
            </Button>
          </div>

          <div>
            <Button variant={"outline"} icon={<Trash2 color="red" />} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <CustomTable
          handleDeleteArticle={deleteBlog}
          headers={headers}
          onEdit={handleEdit}
          data={blog}
        />
      </div>

      <AddBlogCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        articleData={blogCategoryData}
        title={isEditMode ? "Update Blog " : "Add Blog "}
        setArticleData={setBlogCategoryData}
        onSave={handleSave}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        type="page"
        loading={loading}
      />
    </div>
  );
};

export default Blog;
