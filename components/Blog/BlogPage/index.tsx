"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import { apiRequest } from "@/utils/apiRequest";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/Common/CustomTable";
import { AddBlogCategoryModal } from "../Category/AddBlogCategory";

const BlogPage = () => {
  const headers = [
    { label: "Image", key: "image" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
  ];

  const [blog, setBlog] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const [blogCategoryData, setBlogCategoryData] = useState({
    title: "",
    desc: "",
    image: null as File | null,
  });

  const fetchBlog = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/v1/admin/allBlogPage`, "GET");
      if (data?.status === 200) {
        const articlesArray = data?.data;

        const formattedData = [
          {
            id: articlesArray?._id,
            image: articlesArray?.image,
            title: articlesArray?.title,
            description: articlesArray?.description,
          },
        ];

        setBlog(formattedData);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);
  const handleSave = useCallback(async () => {
    try {
      if (!blogCategoryData.title || !blogCategoryData.desc) {
        console.log("Missing data:", blogCategoryData);
        return;
      }

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
          `/api/v1/admin/BlogCategory/updateBlogCategory/${selectedArticle.id}`,
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

      setBlogCategoryData({
        title: "",
        desc: "",
        image: null,
      });
      setIsEditMode(false);
      setOpenModal(false);
      fetchBlog();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  }, [blogCategoryData, isEditMode, selectedArticle, fetchBlog]);

  const deleteBlogPage = useCallback(
    async (id: any) => {
      try {
        const response = await apiRequest(
          `/api/v1/admin/deleteBlogPage`,
          "DELETE",
          { id }
        );
        if (response) {
          fetchBlog();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [fetchBlog]
  );

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[28px] font-semibold text-[#202224]">
          Blog Page
        </div>

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
            <Button
              variant={"outline"}
              icon={<Trash2 color="red" />} 
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <CustomTable
          handleDeleteArticle={deleteBlogPage}
          headers={headers}
          data={blog}
          type={"blog_page"}
        />
      </div>

      <AddBlogCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        articleData={blogCategoryData}
        title={isEditMode ? "Update Blog Page" : "Add Blog page"}
        setArticleData={setBlogCategoryData}
        onSave={handleSave}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        type="page"
      />
    </div>
  );
};

export default BlogPage;
