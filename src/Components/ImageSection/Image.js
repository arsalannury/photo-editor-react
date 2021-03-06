import { Component } from "react";
import {
  Container,
  ImageWrapper,
  CurrentImage,
  LoadingImage,
  Empty,
  Wait,
  Div,
} from "./ImageStyle";
import { connect } from "react-redux";
import { setImage } from "../../Redux/Reducers/ImageReducer";
import {
  showLoading,
  hideFilterSection,
} from "../../Redux/Reducers/UiReducers";
import { setFilterTitle,setRangeValue } from "../../Redux/Reducers/FiltersReducer";
import axios from "axios";
import Swal from "sweetalert2";

class Image extends Component {
  handleSwalMessage = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Deleted",
    });
  };

  handleDeletePhoto = async () => {
    const data = localStorage.getItem("imageDatabaseName");
    try {
      const response = await axios.delete(
        `https://react-photo-editor-dd3e0-default-rtdb.firebaseio.com/Image/${data}.json`
      );
      this.props.setImageHandler();
      this.props.loading();
      this.props.filterDisplay();
      localStorage.removeItem("imageDatabaseName");
      this.handleSwalMessage();
      this.props.applyFilterTitle("filterName");
      this.props.rangeInput("0");
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    return (
      <>
        <Container className="col-md-6">
          <ImageWrapper className="shadow-sm h-100 bg-light rounded d-flex align-items-center justify-content-center position-relative">
            {this.props.setImage === "" ? (
              <>
                <div className="d-flex align-items-center flex-column">
                  <Empty>Choose an image</Empty>
                  <Empty>or wait for load image</Empty>
                  <LoadingImage></LoadingImage>
                </div>
              </>
            ) : !this.props.showLoading ? (
              <>
                <Div>
                  <i
                    onClick={this.handleDeletePhoto}
                    class="bi bi-x-circle"
                    style={{ fontSize: "25px" }}
                  ></i>
                </Div>
                <CurrentImage
                  style={{
                    filter:
                      this.props.filterTitle === "Default"
                        ? "unset"
                        : this.props.filterTitle +
                          "(" +
                          this.props.rangeInp +
                          this.props.filterModel +
                          ")",
                          width: this.props.width,
                          height: this.props.height,
                          borderRadius: this.props.radius
                  }}
                  src={this.props.setImage}
                  alt="edit-picture"
                />
              </>
            ) : (
              <>
                <div className="d-flex align-items-center flex-column">
                  <Wait>wait for loading image...</Wait>
                  <LoadingImage></LoadingImage>
                </div>
              </>
            )}
          </ImageWrapper>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    setImage: state.UiReducersCombine.ImageReducer.currentImage,
    showLoading: state.UiReducersCombine.UiReducers.isFetch,
    imageFilter: state.FiltersCombine.FiltersReducer.filter,
    filterModel: state.FiltersCombine.FiltersReducer.filterModel,
    filterTitle: state.FiltersCombine.FiltersReducer.filterTitle,
    rangeInp: state.FiltersCombine.FiltersReducer.rangeInput,
    width: state.FiltersCombine.FiltersReducer.imageWidth,
    height: state.FiltersCombine.FiltersReducer.imageHeight,
    radius: state.FiltersCombine.FiltersReducer.imageRadius,
  };
};

const mapDispatchStateToProps = (dispatch) => {
  return {
    setImageHandler: () => {
      dispatch(setImage(""));
    },
    loading: () => {
      dispatch(showLoading(true));
    },
    filterDisplay: () => {
      dispatch(hideFilterSection());
    },
    applyFilterTitle: (payload) => {
       dispatch(setFilterTitle(payload))
    },
    rangeInput: (payload) => {
      dispatch(setRangeValue(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchStateToProps)(Image);
