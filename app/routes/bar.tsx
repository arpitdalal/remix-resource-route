import { Form } from 'remix';

const Bar = () => {
  return (
    <>
      <h1>Bar Route w/o layout</h1>
      <Form action="/" method="post">
        <input type="text" name="name" defaultValue="foo" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
};

export default Bar;
