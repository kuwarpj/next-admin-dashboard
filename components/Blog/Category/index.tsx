"use client";
import { CustomTable } from "@/components/Common/CustomTable";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/utils/apiRequest";
import { PlusIcon, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { AddBlogCategoryModal } from "./AddBlogCategory";

const BlogCategory = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [blogCategoryData, setBlogCategoryData] = useState({
    title: "",
    desc: "",
  });

  const [blogCategory, setBlogCategory] = useState<any[]>([]);
  const headers = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
  ];

  const fetchBlog = useCallback(async () => {
    try {
      const data = await apiRequest(
        `/api/v1/admin/BlogCategory/allBlogCategory`,
        "GET"
      );
      if (data?.status === 200) {
        console.log("This is blog", data?.data);

        const articlesArray = data?.data;
        const formattedData = articlesArray.map((article: any) => ({
          id: article?._id,
          title: article.title,
          description: article.description,
        }));
        setBlogCategory(formattedData);
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
      setLoading(true);
      const payload = {
        title: blogCategoryData.title,
        description: blogCategoryData.desc,
      };
      let response;

      if (isEditMode && selectedArticle?.id) {
        response = await apiRequest(
          `/api/v1/admin/BlogCategory/updateBlogCategory/${selectedArticle.id}`,
          "PUT",
          payload
        );
      } else {
        response = await apiRequest(
          "/api/v1/admin/BlogCategory/addBlogCategory",
          "POST",
          payload
        );
      }

      if (response) {
        setBlogCategoryData({
          title: "",
          desc: "",
        });
        setIsEditMode(false);
        setOpenModal(false);
        fetchBlog();
      }
    } catch (error) {
      console.error(error);
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
    });
    setIsEditMode(true);
    setOpenModal(true);
  }, []);

  const handleBlogCategory = useCallback(
    async (id: any) => {
      try {
        setLoading(true);
        const response = await apiRequest(
          `/api/v1/admin/BlogCategory/deleteBlogCategory/${id}`,
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
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-[28px] font-semibold text-[#202224]">
            Blog Category
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
              ></Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <CustomTable
            headers={headers}
            onEdit={handleEdit}
            data={blogCategory}
            handleDeleteArticle={handleBlogCategory}
          />
        </div>

        <AddBlogCategoryModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          articleData={blogCategoryData}
          title={isEditMode ? "Update Blog Category" : "Add Blog Category"}
          setArticleData={setBlogCategoryData}
          onSave={handleSave}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BlogCategory;
