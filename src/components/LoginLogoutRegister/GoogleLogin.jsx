import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
function GoogleLoginButton() {
    return (
        <>
            <div>
                <GoogleOAuthProvider clientId="941386071372-r6e9jp2ddicqnvvtl5g5qr8rrtqj7v11.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            const decoded = jwtDecode(credentialResponse.credential);

                            console.log(decoded);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />;

                </GoogleOAuthProvider>;

            </div>
        </>
    );
}
export default GoogleLoginButton;