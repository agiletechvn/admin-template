import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';

import { Notification, translate, userLogin } from 'react-admin';

const styles = theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url(/images/bg-login.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    avatar: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary.main,
    },
    hint: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        color: theme.palette.grey[500],
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
    actions: {
        padding: '0 1em 1em 1em',
    },
});

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({
    meta: { touched, error } = {},
    input: { ...inputProps },
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

class Login extends Component {
    state = {
        step: 1,
    };

    login = auth =>
        this.props.userLogin(
            auth,
            this.props.location.state
                ? this.props.location.state.nextPathname
                : '/'
        );

    renderStep() {
        const { classes, handleSubmit, isLoading, translate } = this.props;
        const { step } = this.state;
        switch (step) {
            case 1:
                return (
                    <div>
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <strong>Chào mừng đến Veep portal</strong>
                                <br />
                                <small>
                                    Vui lòng đăng nhập bằng số điện thoại
                                </small>
                                <Field
                                    name="phonenumber"
                                    component={renderInput}
                                    label={translate('ra.auth.phonenumber')}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <CardActions className={classes.actions}>
                            <Button
                                variant="raised"
                                onClick={() =>
                                    this.setState({ step: step + 1 })
                                }
                                style={{ backgroundColor: '#FFE401' }}
                                disabled={isLoading}
                                className={classes.button}
                                fullWidth
                            >
                                {isLoading && (
                                    <CircularProgress size={25} thickness={2} />
                                )}
                                {translate('ra.auth.continue')}
                            </Button>
                        </CardActions>
                        <small>Bạn chưa có app của Veep?</small>
                        <div
                            style={{ flex: 1, justifyContent: 'space-around' }}
                        >
                            <img src="/images/app-store.png" />
                            <img src="/images/google-play.png" />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <form onSubmit={handleSubmit(this.login)}>
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <strong>Nhập mã OTP</strong>
                                <br />
                                <small>
                                    Mã OTP đã được gửi vào app trên điện thoại
                                    của bạn.{' '}
                                    <a
                                        onClick={() =>
                                            this.setState({ step: step - 1 })
                                        }
                                    >
                                        Quay lại
                                    </a>{' '}
                                    để đổi số điện thoại khác.
                                </small>
                                <Field
                                    name="otp"
                                    component={renderInput}
                                    label={translate('ra.auth.otp')}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <CardActions className={classes.actions}>
                            <Button
                                variant="raised"
                                type="submit"
                                style={{ backgroundColor: '#FFE401' }}
                                disabled={isLoading}
                                className={classes.button}
                                fullWidth
                            >
                                {isLoading && (
                                    <CircularProgress size={25} thickness={2} />
                                )}
                                {translate('ra.auth.login')}
                            </Button>

                            <Button
                                variant="raised"
                                style={{ backgroundColor: '#FFE401' }}
                                disabled={isLoading}
                                className={classes.button}
                                fullWidth
                            >
                                {translate('ra.auth.resend')}
                            </Button>
                        </CardActions>
                    </form>
                );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.main}>
                <Card className={classes.card}>
                    <div className={classes.hint}>
                        <img className={classes.logo} src="/images/logo.png" />{' '}
                        | <span>Fleet</span>
                    </div>
                    {this.renderStep()}
                    <div className="d-flex justify-content-around">
                        <span>© Veep 2018</span>
                        <span>Hỗ trợ trực tiếp</span>
                    </div>
                </Card>
                <Notification />
            </div>
        );
    }
}

Login.propTypes = {
    ...propTypes,
    authProvider: PropTypes.func,
    classes: PropTypes.object,
    previousRoute: PropTypes.string,
    translate: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
    translate,
    reduxForm({
        form: 'signIn',
        validate: (values, props) => {
            const errors = {};
            const { translate } = props;
            if (!values.phonenumber) {
                errors.phonenumber = translate('ra.validation.required');
            }
            return errors;
        },
    }),
    connect(
        mapStateToProps,
        { userLogin }
    ),
    withStyles(styles)
);

export default enhance(Login);
