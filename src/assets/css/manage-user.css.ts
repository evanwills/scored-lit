import { css } from "lit";

export default css`
h2 { margin-bottom: 0.5rem; }
p { margin-top: 0;}
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
li {
  margin: 0;
  padding: 0;
}
.field-wrap {
  border-top: 0.05rem solid #fff
}
.field-item {
  border-bottom: 0.05rem solid #fff;
  padding-bottom: 0.5rem;;
  padding-top: 0.5rem;
}
.field-item label {
  display: inline-block;
  width: 6.5rem;
}
.field-item label::after {
  content: ':';
}
.field-item input {
  flex-grow: 1;
}
.list-wrap {
  border-top: 0.05rem solid #999;
}
.list-item {
  padding: 0.25rem 0;
  border-bottom: 0.05rem solid #999;
}
.list-item label {
  flex-grow: 1;
}
`;
