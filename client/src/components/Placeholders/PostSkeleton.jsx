import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import styled from "styled-components";
const PostSkeleton = () => {
  return (
    <Container>
      <MDBCard
        style={{ width: "40rem" }}
        aria-hidden="true"
        className="card m-auto"
      >
        <MDBCardBody>
          <MDBCardTitle className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </MDBCardTitle>
          <MDBCardText className="placeholder-glow">
            <span className="placeholder col-10"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
            <span className="placeholder col-5"></span>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </Container>
  );
};
const Container = styled.div`
  .card {
    @media screen and (max-width: 675px) {
      width: 100%;
    }
  }
`;
export default PostSkeleton;
