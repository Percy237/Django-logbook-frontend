import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as api from "../api";
import { useEffect } from "react";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(api.register, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("auth");
      toast.success("Registration successful", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    onError: async (error) => {
      console.log(error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  const { data, error, isLoading } = useQuery("classes", api.getClasses);
  console.log(data);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("email", {
                      required: "This field is required",
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="date_of_birth"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Date of Birth
                </label>
                <div className="mt-2">
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    autoComplete="date_of_birth"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("date_of_birth", {
                      required: "This field is required",
                    })}
                  />
                  {errors.date_of_birth && (
                    <span className="text-red-500">
                      {errors.date_of_birth.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("gender", {
                      required: "This field is required",
                    })}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-500">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="class_enrolled"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Class enrolled
                </label>
                <div className="mt-2">
                  <select
                    id="class_enrolled"
                    name="class_enrolled"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("class_enrolled", {
                      required: "This field is required",
                    })}
                  >
                    <option value="">Select your class</option>
                    {data?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.class_enrolled && (
                    <span className="text-red-500">
                      {errors.class_enrolled.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                    {...register("password", {
                      required: "This field is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
                  mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <span className="loader"></span>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            Already have an account?
            <Link to="/login" className="underline ml-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
