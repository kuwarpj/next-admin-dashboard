"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRight, Delete, DeleteIcon, PlusIcon, Trash2 } from "lucide-react";
import { CustomTable } from "../Common/CustomTable";
import { AddArticleModal } from "../Common/AddArticle";
import { apiRequest } from "@/utils/apiRequest";

const Article = () => {
  const [openModal, setOpenModal] = useState(false);
  const [articleData, setArticleData] = useState({
    title: "",
    desc: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);


  const headers = [
    { label: "Image", key: "image" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
 
  ];

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handleSave = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      if (articleData.title && articleData.desc) {
        formData.append("title", articleData.title);
        formData.append("description", articleData.desc);
      } else {
        console.log("Missing data:", articleData);
      }
      if (articleData.image && articleData.image instanceof File) {
        formData.append("image", articleData.image);
      } else {
        console.log("No image selected");
      }
      let response;
      if (isEditMode && selectedArticle?.id) {
        response = await apiRequest(
          `/api/v1/admin/Article/updateArticle/${selectedArticle.id}`,
          "PUT",
          formData
        );
      } else {
        response = await apiRequest(
          "/api/v1/admin/Article/createArticle",
          "POST",
          formData
        );
      }

      console.log("Response:", response);

      setArticleData({
        title: "",
        desc: "",
        image: null,
      });
      setIsEditMode(false);
      setOpenModal(false);
      fetchArticles(currentPage);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false); 
    }
  };

  const fetchArticles = async (page: number) => {
    try {
      const data = await apiRequest(
        `/api/v1/admin/Article/getArticle?page=${page}&limit=10`,
        "GET"
      );
      if (data?.status === 200) {
        const formattedData = Array.isArray(data.data.docs)
          ? data.data.docs.map((article: any) => ({
              id: article?._id,
              image: article.image,
              title: article.title,
              description: article.description,
            }))
          : [];

        setArticles(formattedData);

        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setArticleData({
      title: article.title,
      desc: article.description,
      image: article?.image,
    });
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteArticle = async (id: any) => {
    try {
      setLoading(true)
      const response = await apiRequest(
        `/api/v1/admin/Article/deleteArticle/${id}`,
        "DELETE"
      );

      if (response?.msg === "deleted") {
        console.log(response);
        fetchArticles(currentPage);
      }
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false); 
    }
  };
  const startIndex = (currentPage - 1) * 10 + 1;
  const endIndex = Math.min(currentPage * 10, totalItems);
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[28px] font-semibold text-[#202224]">Articles</div>

        <div className="flex gap-2 ">
          <div>
            <Button
              onClick={() => setOpenModal(true)}
              variant={"default"}
              icon={<PlusIcon className="size-4" />}
            >
              Add new article
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
          data={articles}
          handleDeleteArticle={handleDeleteArticle}
        />
      </div>

      <div className="flex justify-between items-center p-4">
        <div className="text-sm font-semibold text-[#202224]">
          {`Showing ${startIndex}-${endIndex} of ${totalItems}`}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-[30px] cursor-pointer"
            icon={<ChevronLeftIcon />}
          ></Button>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="h-[30px] cursor-pointer"
            disabled={currentPage === totalPages}
            icon={<ChevronRight />}
          ></Button>
        </div>
      </div>

      <AddArticleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        articleData={articleData}
        title={isEditMode ? "Update Article" : "Add Article"}
        setArticleData={setArticleData}
        onSave={handleSave}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        loading={loading}
        
      />
    </div>
  );
};

export default Article;
