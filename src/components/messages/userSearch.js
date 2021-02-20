import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import { Row, Item } from '@mui-treasury/components/flex';
import { Info, InfoTitle, InfoSubtitle } from '@mui-treasury/components/info';
import { useTutorInfoStyles } from '@mui-treasury/styles/info/tutor';
import { useSizedIconButtonStyles } from '@mui-treasury/styles/iconButton/sized';
import { useDynamicAvatarStyles } from '@mui-treasury/styles/avatar/dynamic';

const useStyles = makeStyles(() => ({
    action: {
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#000',
        },
    },
    row: {
        minWidth: "98%",
        display: "flex",
        alignItems: "center"
    }
}));

const handleClick = (props) => {
    props.setUserToShow(props.user);
}

const newMessage = props => {
    props.setUserToShow(props.user);
    props.newChat();
}

export const UserComponent = React.memo(function TutorCard(props) {
    const styles = useStyles();
    const iconBtnStyles = useSizedIconButtonStyles({ padding: 8 });
    const avatarStyles = useDynamicAvatarStyles({ radius: 12, size: 48 });
    return (
        <Row p={0.5} gap={2} bgcolor={'#f5f5f5'} borderRadius={16} className={styles.row}>
            <Item onClick={handleClick.bind(this, props)}>
                <Avatar
                    classes={avatarStyles}
                    src={props.user.image}
                />
            </Item>
            <Info onClick={handleClick.bind(this, props)} position={'middle'} useStyles={useTutorInfoStyles}>
                <InfoTitle>{props.user.firstName} {props.user.lastName}</InfoTitle>
                <InfoSubtitle>{props.user.service}</InfoSubtitle>
                <InfoSubtitle>{props.user.position}</InfoSubtitle>
            </Info>
            <Item onClick={newMessage.bind(this, props)} mr={0.5} position={'middle'}>
                <IconButton className={styles.action} classes={iconBtnStyles}>
                    <ChatIcon />
                </IconButton>
            </Item>
        </Row>
    );
});