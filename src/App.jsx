import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {Form, FormGroup, Label, Input, FormFeedback, FormText, Col, Button, Container, Row, Card, CardBody, Table, CardTitle} from 'reactstrap';
import { createTransaction } from './firebase/firebase';
import { readTransaction } from './firebase/firebase';
import { deleteTransaction } from './firebase/firebase';
import { updateTransaction } from './firebase/firebase';

function App() {
  const [list, setList] = useState([]);
  const [listObj, setListObj] = useState({});
  const [selectedTrnsc, setSelectedTrnsc] = useState(null);

  const transactionTypes = [
    {
      label: 'Income',
      value: 'income'
    },
    {
      label: 'Expense',
      value: 'expense'
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
    if(selectedTrnsc){
      updateTransaction(selectedTrnsc, variables?.title, variables?.amount, variables?.type);
      setSelectedTrnsc(null)
    } else {
      createTransaction(variables?.title, variables?.amount, variables?.type);
    }
  }

  const calcTotalIncome = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if(listObj[key]?.type === 'income'){
        total += listObj[key]?.amount;
      }
    })
    return total;
  }

  const calcTotalExpense = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if(listObj[key]?.type === 'expense'){
        total -= listObj[key]?.amount;
      }
    })
    return total;
  }

  const calcCurrentBalance = () => {
    let total = 0;
    Object.keys(listObj).map((key) => {
      if(listObj[key]?.type === 'income'){
        total += listObj[key]?.amount;
      } else {
        total -= listObj[key]?.amount;
      }
    })
    return total;
  }

  const callbackFunc = (data) => {
    // console.log(data, "transaction");
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
          initialValues={{ title: '', amount: '', type: 'income' }}
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
              <Button type="submit">{selectedTrnsc ? "Edit" : "Submit"}</Button>
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
                      <Button onClick={() => deleteTransaction(key)}>Delete</Button>
                      <Button onClick={() => setSelectedTrnsc(key)}>Edit</Button>
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
      <Row>
        <Col>
              <Card>
                  <CardTitle>
                    Total Income: ${calcTotalIncome()}
                  </CardTitle>
              </Card>
        </Col>
        <Col>
              <Card>
                  <CardTitle>
                    Total Expense: ${calcTotalExpense()}
                  </CardTitle>
              </Card>
        </Col>
        <Col>
              <Card>
                  <CardTitle>
                    Current Balance: ${calcCurrentBalance()}
                  </CardTitle>
              </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
