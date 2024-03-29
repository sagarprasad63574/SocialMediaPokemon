import React from "react";
import { editProfile } from "../../api/profiles/profileAPI";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ProfileEditForm = (props: any) => {
    const { profile, setProfile, visible, setVisible } = props;
    const { userToken } = useSelector((state: any) => state.auth);
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const newBio = {
            name: elems[0].value,
            email: elems[1].value,
            biography: elems[2].value
        };
        try {
            let data = await editProfile(userToken, newBio);
            setProfile(newBio);
            setVisible(!visible);
        } catch (error) {
            console.log("error: ", error);
        }
    };
    const handleRevert = (event: any) => {
        event.preventDefault();
        setVisible(!visible);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required placeholder={profile.name} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required placeholder={profile.email} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBiography">
                <Form.Label>Biography</Form.Label>
                <Form.Control as="textarea" rows={3} required placeholder={profile.biography} />
            </Form.Group>
            <div className="mt-4">
                <Button style={{marginRight: "20px"}} variant="success" type="submit">Submit</Button>
                <Button  style={{marginRight: "20px"}} variant="danger" type="reset">Reset</Button>
                <Button variant="info" onClick={handleRevert}>Revert</Button>
            </div>
        </Form>
    );
};

export default ProfileEditForm;