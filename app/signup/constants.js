export const SIGNUP_FIELDS = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "number",
    placeholder: "Enter your mobile number",
    required: true,
    props: { maxLength: 10 },
  },
  {
    name: "pincode",
    label: "Pincode",
    type: "number",
    placeholder: "Enter your pincode",
    required: true,
    props: { maxLength: 6 },
  },
];

