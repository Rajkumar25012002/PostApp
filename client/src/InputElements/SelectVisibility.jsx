import Select, { components } from "react-select";
import { MDBIcon } from "mdb-react-ui-kit";
const SelectVisibility = ({ options, post, setPost }) => {
  const { Option } = components;
  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} style={{ display: "flex", alignItems: "center" }}>
      <MDBIcon fas icon={data.icon} className="" style={{ width: "2.15rem" }} />{" "}
      {label}
    </div>
  );
  const customComponents = {
    Option: (props) => (
      <Option {...props}>
        <CustomOption {...props} />
      </Option>
    ),
  };
  return (
    <Select
      options={options}
      value={{
        value: post.visibility,
        label: post.visibility,
      }}
      onChange={(e) => {
        setPost({
          ...post,
          visibility: e.value,
        });
      }}
      isSearchable={false}
      components={customComponents}
      styles={{
        control: (provided, state) => ({
          ...provided,
          width: "6.75rem",
          borderRadius: "1.5rem",
          textAlign: "center",
          outline: state.isFocused ? "none" : "none",
          border: state.isFocused ? "none" : "none",
          boxShadow: state.isFocused ? "none" : "none",
        }),
      }}
    />
  );
};

export default SelectVisibility;
