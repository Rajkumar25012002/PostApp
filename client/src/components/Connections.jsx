import {
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useOutletContext, useParams } from "react-router";
import { useNavigate } from "react-router";
import UserDisplayCard from "./UserDisplayCard";
const Connections = () => {
  const { userinfo } = useOutletContext();
  const navigate = useNavigate();
  const { connections } = useParams();
  const followersList = userinfo?.userHistory?.followers || [];
  const followingList = userinfo?.userHistory?.followings || [];
  const connectionList =
    connections === "followers" ? followersList : followingList;

  return (
    <MDBModal show={true} tabIndex="-1" onHide={() => navigate(-1)}>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{connections.toUpperCase()}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => navigate(-1)}
            />
          </MDBModalHeader>
          <MDBModalBody style={{ overflowY: "auto", maxHeight: "30rem" }}>
            {connectionList.length > 0 ? (
              connectionList.map((user, index) => {
                return <UserDisplayCard key={index} userid={user} />;
              })
            ) : (
              <p className="m-0 fw-bold text-center">{`You have no ${connections}`}</p>
            )}
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default Connections;
