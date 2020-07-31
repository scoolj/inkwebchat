import React from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import { Form, Input, Button } from "antd";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        username: "",
        userstate: "",
        usercountry: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        userstate: Yup.string().required("Userstate is required"),
        usercountry: Yup.string().required("Usercountry is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            username: values.username,
            userstate: values.userstate,
            usercountry: values.usercountry,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg);
            }
          });

          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">
            <h2>Sign up</h2>
            <Form
              style={{ minWidth: "375px" }}
              {...formItemLayout}
              onSubmit={handleSubmit}
            >
              <Form.Item required label="Username">
                <Input
                  id="username"
                  placeholder="Enter your username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.username && touched.username
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.username && touched.username && (
                  <div className="input-feedback">{errors.username}</div>
                )}
              </Form.Item>

              <Form.Item required label="Country">
                <CountryDropdown
                  name="usercountry"
                  value={values.usercountry}
                  onChange={(_, e) => handleChange(e)}
                  onBlur={handleBlur}
                  style={{
                    backgroundColor: "",
                    color: "",
                    fontSize: 21,
                    width: 251,
                    // innerHeight: 25,
                  }}
                />

                {errors.usercountry && touched.usercountry && (
                  <div className="input-feedback">{errors.usercountry}</div>
                )}
              </Form.Item>

              <Form.Item required label="State">
                <RegionDropdown
                  name="userstate"
                  value={values.userstate}
                  country={values.usercountry}
                  onChange={(_, e) => handleChange(e)}
                  onBlur={handleBlur}
                  style={{
                    backgroundColor: "",
                    color: "",
                    fontSize: 21,
                    width: 251,
                    // innerHeight: 25,
                  }}
                />

                {errors.userstate && touched.userstate && (
                  <div className="input-feedback">{errors.userstate}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  onClick={handleSubmit}
                  type="primary"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
