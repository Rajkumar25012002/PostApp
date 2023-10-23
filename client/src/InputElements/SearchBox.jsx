import { useSelector } from "react-redux";
import { selectAllUsers } from "../features/userSlice";
import Select from "react-select";
import { useNavigate } from "react-router";
const SearchBox = () => {
  const navigate = useNavigate();
  const allUsers = useSelector(selectAllUsers);
  let options = allUsers.map((user) => {
    return {
      value: "/user/" + user.userid,
      label: user.user_name,
    };
  });
  options = [{ value: "/", label: "" }, ...options];
  const handleUserSelect = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      navigate(selectedOption.value);
    }
  };

  return (
    <Select
      options={options}
      onChange={handleUserSelect}
      placeholder=""
      styles={{
        control: (provided) => ({
          ...provided,
          maxWidth: "25rem",
          minWidth: "20rem",
        }),
      }}
    />
  );
};

export default SearchBox;
