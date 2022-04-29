import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {Form, FormGroup, Label, Input, FormFeedback, FormText, Col, Button, Container, Row, Card, CardBody, Table} from 'reactstrap';
import { createTransaction } from './firebase/firebase';
import { readTransaction } from './firebase/firebase';

function App() {
  const [list, setList] = useState([]);
  const [listObj, setListObj] = useState({});

  const transactionTypes = [
    {
      label: 'Income',
      value: 'Income'
    },
    {
      label: 'Expense',
      value: 'Expense'
    }
  ]

  const TransactionSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    amount: Yup.string()
      .min(0)
      .required('Required'),
    type: Yup.string().required('Required'),
  });


  const onSubmit = (variables) => {
    setList([...list, variables]);
    let key = Math.random();
    setListObj({
      ...listObj,
      [key]: variables
    });
    createTransaction(variables?.title, variables?.amount, variables?.type)
  }

  const onDelete = (transactionIndex) => {
    let filteredList = list.filter((item, index) => index !== transactionIndex);
    setList(filteredList);
  }

  const callbackFunc = (data) => {
    console.log(data, "transaction");
    setListObj(data)
  }

  useEffect(() => {
    readTransaction(callbackFunc)
  }, [])


  return (
    <Container>
      <Row>
        <Col>
          <Formik
          initialValues={{ title: '', amount: '', type: 'Income' }}
          validationSchema={TransactionSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="exampleEmail">
                  Title
                </Label>
                <Input 
                  type="text"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  placeholder="Title"
                  invalid={errors.title && touched.title}/>
                {errors.title && touched.title && 
                  <FormFeedback tooltip>
                    {errors?.title}
                  </FormFeedback>}
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">
                  Amount
                </Label>
                <Input 
                  type="number"
                  name="amount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.amount}
                  placeholder="Amount"
                  invalid={errors.amount && touched.amount}/>
                {errors.amount && touched.amount && 
                <FormFeedback tooltip>
                  {errors?.amount}
                </FormFeedback>}
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect" sm={2}>
                  Type
                </Label>
                <Input
                    id="exampleSelect"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.type}
                    name="type"
                    type="select"
                    invalid={errors.type && touched.type}>
                      {
                        transactionTypes.map(option => (
                        <option key={option?.value} value={option?.value}>{option?.label}</option>
                        ))
                      }
                  </Input>
                {errors.type && touched.type && 
                <FormFeedback tooltip>
                  {errors?.type}
                </FormFeedback>}
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Form>
          )}
          </Formik>
        </Col>
        <Col>
        <Card>
          <CardBody>
          <Table hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(listObj).map((key) => (
                  <tr key={key}>
                    <td>{listObj[key]?.title}</td>
                    <td>{listObj[key]?.amount}</td>
                    <td>{listObj[key]?.type}</td>
                    <td>
                      <Button onClick={() => onDelete()}>Delete</Button>
                    </td>
                  </tr>
                ))
              }
              {
                list.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.title}</td>
                    <td>{item?.amount}</td>
                    <td>{item?.type}</td>
                    <td>
                      <Button onClick={() => onDelete(index)}>Delete</Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          </CardBody>
        </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
