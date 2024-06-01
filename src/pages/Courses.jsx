import { useQuery } from "react-query";

import * as api from "../api";
import { Link } from "react-router-dom";

const Courses = () => {
  const { data, error, isLoading } = useQuery(
    "courses",
    api.getCoursesForAClass
  );
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;
  return (
    <div className="py-10 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold underline">Select course</h1>
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-2 mt-5">
          {data.length > 0 ? (
            data.map((course) => (
              <Link
                to={`/class/logbook/course/${course.id}`}
                key={course.id}
                className="bg-black text-white p-3 rounded-sm md:rounded-md xl:rounded-xl cursor-pointer text-center shadow-md"
              >
                {course.name}
              </Link>
            ))
          ) : (
            <div>No courses available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
