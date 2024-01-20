import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import { BiImages } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile, UserLogin } from "../redux/userSlice";
import { apiRequest, handleFileUpload } from "../utils";
import Loading from "./Loading";
import { SetEvents, updateEvents } from "../redux/eventSlice";
import API_URLS from "../utils/apiConfig";

const CreateEvent = ({ fetchEvents, newPostNotifications, socket }) => {
  const { user } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");
    try {
      const { title, description, date, location, participants } = data;

      const res = await apiRequest({
        url: API_URLS.CREATE_EVENT,
        data: {
          title,
          description,
          date,
          location,
          participants,
          userId: user?._id,
        },
        method: "Post",
        token: user?.token,
      });

      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        
        //emit create-event
        socket.current.emit("event-created", { ...res, userId: user._id });
        // dispatch(SetEvents(res.data));
        await fetchEvents();
        setTimeout(() => {
          dispatch(updateEvents(false));
        }, 3000);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleClose = () => {
    // reset();
    dispatch(updateEvents(false));
  };

  return (
    <>
      {/* Modal */}

      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Create A Event
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>

            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="title"
                label="title"
                placeholder="title"
                type="text"
                styles="w-full"
                register={register("title", {
                  required: "title is required!",
                })}
                error={errors.title ? errors.title?.message : ""}
              />

              <TextInput
                label="description"
                placeholder="description"
                type="description"
                styles="w-full"
                register={register("description", {
                  required: "description is required",
                })}
                error={errors.description ? errors.description?.message : ""}
              />

              <TextInput
                name="date"
                label="date"
                placeholder="Event Date"
                type="date"
                styles="w-full"
                register={register("date", {
                  required: "date is required!",
                })}
                error={errors.date ? errors.date?.message : ""}
              />

              <TextInput
                label="Location"
                placeholder="Location"
                type="text"
                styles="w-full"
                register={register("location", {
                  required: "Location do no match",
                })}
                error={errors.location ? errors.location?.message : ""}
              />

              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
