"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { CustomTable } from "../Common/CustomTable";
import { apiRequest } from "@/utils/apiRequest";
import { AddArticleModal } from "../Common/AddArticle";

const Dealership = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [articleData, setArticleData] = useState({
    title: "",
    desc: "",
    // image: null as File | null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const fetchArticles = async () => {
    try {
      const data = await apiRequest(
        `/api/v1/admin/AutoDealerShip/allAutoDealerShip`,
        "GET"
      );
      if (data?.status === 200) {
        const articlesArray = data?.data?.[0]?.everyThing || [];

        const formattedData = articlesArray.map((article: any) => ({
          id: article?._id,
          image: article.image,
          title: article.name,
          desc: article.description,
        }));

        setArticles(formattedData);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (articleData.title && articleData.desc) {
        formData.append("title", articleData.title);
        formData.append("description", articleData.desc);
      } else {
        console.log("Missing data:", articleData);
      }

      //   if (articleData.image) {
      //     formData.append("image", articleData.image);
      //   }

      let response;
      if (isEditMode && selectedArticle?.id) {
        response = await apiRequest(
          `/api/v1/admin/Article/updateArticle/${selectedArticle.id}`,
          "PUT",
          formData
        );
      } else {
        response = await apiRequest(
          "/api/v1/admin/AutoDealerShip/addAutoDealerShip",
          "POST",
          formData
        );
      }

      console.log("Response:", response);

      setArticleData({
        title: "",
        desc: "",
        // image: null,
      });
      setIsEditMode(false);
      setOpenModal(false);
      // fetchArticles(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setArticleData({
      title: article.title,
      desc: article.desc,
      //   image: null,
    });
    setIsEditMode(true);
    setOpenModal(true);
  };
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[32px] font-bold text-[#202224]">
          Auto dealership
        </div>

        <div className="flex gap-2 ">
          <div>
            <Button
              onClick={() => setOpenModal(true)}
              variant={"default"}
              icon={<PlusIcon className="size-4" />}
            >
              Add Auto dealership
            </Button>
          </div>

          <div>
            <Button
              variant={"outline"}
              icon={<img src="./svg/delete.svg" alt="Delete" />}
            ></Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <CustomTable
          onEdit={handleEdit}
          data={articles}
          //   handleDeleteArticle={handleDeleteArticle}
        />
      </div>

      {/* <div className="flex justify-between items-center p-4">
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
      </div> */}
{/* 
      <AddArticleModal
        open={openModal}
        title={isEditMode ? "Update DealerShip" : "Add Dealership"}
        onClose={() => setOpenModal(false)}
        articleData={articleData}
        setArticleData={setArticleData}
        onSave={handleSave}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      /> */}
    </div>
  );
};

export default Dealership;
