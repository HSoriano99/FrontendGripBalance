import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "./Home.css"

export const Home = () => {
  return (
    
    <Container>
      <h1 className="text-center ">Welcome to Grip Balance</h1>
      <p className="text-center mb-5">Explore the world of motorsport events and discover thrilling races, exciting exhibitions, and more!</p>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="event-card">
            <Card.Img variant="top" src="https://i0.wp.com/pitpad.com/wp-content/uploads/2021/09/final-bout-2021-70.jpg?w=717&h=478&ssl=1" />
            <Card.Body>
              <Card.Title>Grassroots Drift Events, Timeattack Days and more! </Card.Title>
              <Card.Text>
                Experience the scene with our thrilling events. Join fellow enthusiasts and show off your skills!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="event-card">
            <Card.Img variant="top" src="https://i.pinimg.com/originals/b5/5f/97/b55f977551f8007f4f689b89d75158a2.jpg" />
            <Card.Body>
              <Card.Title>User Garage</Card.Title>
              <Card.Text>
                Manage your car collection in your personal garage. Add, remove, and customize your vehicles to your heart's content!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="event-card">
            <Card.Img variant="top" src="https://www.streetmachine.com.au/wp-content/uploads/2023/09/world-time-attack-challenge-2923-0649-scaled.jpg" />
            <Card.Body>
              <Card.Title>Event Registrations</Card.Title>
              <Card.Text>
                Sign up for upcoming events and competitions with your own cars. Compete against others and strive for victory!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
      );
    }

