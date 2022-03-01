import { Form } from 'remix';

const Index = () => {
  return (
    <>
      <h1>Index Route w/ layout</h1>
      <Form action="/" method="post">
        <input type="text" name="name" defaultValue="foo" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
};

export default Index;
