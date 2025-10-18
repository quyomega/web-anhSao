document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginBtn = document.querySelector(".login-btn");

  togglePassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const currentType = passwordInput.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";

    passwordInput.setAttribute("type", newType);

    if (newType === "text") {
      togglePassword.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2665 1.85005C17.5106 1.60597 17.9062 1.60597 18.1503 1.85005C18.3943 2.09413 18.3944 2.48979 18.1503 2.73384L2.73364 18.1505C2.48959 18.3945 2.09393 18.3945 1.84985 18.1505C1.60578 17.9064 1.6058 17.5108 1.84985 17.2667L4.41496 14.7008L4.30672 14.6097C3.60651 14.0101 2.85546 13.2724 2.28524 12.4173L2.28605 12.4165C1.85956 11.7777 1.66676 10.9621 1.66675 10.1834C1.66679 9.40444 1.85931 8.5883 2.28605 7.9495C4.11875 5.19731 6.80044 3.54194 9.73804 3.54194C11.1985 3.54196 13.0515 3.78172 14.4963 4.61942L17.2665 1.85005ZM9.73804 4.79194C7.30355 4.79194 4.97782 6.16067 3.32528 8.64286C3.06724 9.02913 2.91679 9.58831 2.91675 10.1834C2.91675 10.7042 3.03159 11.1971 3.23332 11.5709L3.32528 11.7231L3.54175 12.0291C3.99417 12.6305 4.55628 13.1769 5.11727 13.6575L5.30282 13.8129L7.23641 11.8793C6.8779 11.3645 6.66677 10.7402 6.66675 10.0638C6.66675 8.30082 8.09229 6.87528 9.85522 6.87528C10.5374 6.87529 11.1435 7.13364 11.6309 7.48482L13.5735 5.54227C12.4509 4.99169 11.0106 4.79196 9.73804 4.79194ZM9.85522 8.12528C8.78264 8.12528 7.91675 8.99117 7.91675 10.0638C7.91676 10.3743 7.99129 10.6653 8.12101 10.9248L10.7219 8.38244C10.4477 8.22067 10.1522 8.12529 9.85522 8.12528Z" fill="#757B86"/>
        <path d="M15.7821 6.18111C16.0505 5.96415 16.444 6.00551 16.6611 6.27388C16.955 6.63738 17.2439 7.02855 17.5107 7.44657L17.5872 7.57189C17.9573 8.21164 18.1251 9.00024 18.1251 9.75532C18.125 10.5606 17.9343 11.4038 17.5107 12.0641L17.5098 12.0633C15.6759 14.9306 12.9857 16.6669 10.0261 16.6669C9.12687 16.6669 8.24419 16.5014 7.40649 16.1958L7.05005 16.0566L6.99227 16.0289C6.71413 15.8777 6.59082 15.5371 6.71558 15.2387C6.84061 14.9402 7.17011 14.7891 7.47323 14.8815L7.53345 14.9034L7.83455 15.0214C8.54303 15.28 9.28126 15.4169 10.0261 15.4169C12.4587 15.4169 14.7933 13.9923 16.4576 11.3903L16.4584 11.3894L16.552 11.2267C16.7578 10.8295 16.875 10.3069 16.8751 9.75532C16.8751 9.12489 16.722 8.53203 16.4584 8.12121L16.4576 8.11958C16.2205 7.74806 15.9595 7.39501 15.6886 7.06001C15.4716 6.79163 15.5138 6.39813 15.7821 6.18111Z" fill="#757B86"/>
        <path d="M11.8857 10.3038C11.9482 9.96443 12.2738 9.74004 12.6132 9.80252C12.9526 9.86514 13.177 10.1907 13.1145 10.5301C12.8562 11.9307 11.7222 13.0648 10.3215 13.323C9.9822 13.3855 9.65666 13.161 9.59399 12.8217C9.53151 12.4823 9.7559 12.1568 10.0953 12.0942C10.9861 11.9299 11.7213 11.1946 11.8857 10.3038Z" fill="#757B86"/>
      `;
    } else {
      togglePassword.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2815 3.3382C13.1807 3.43935 15.8695 5.09983 17.7587 7.90932C18.1375 8.47081 18.3289 9.2213 18.3332 9.97394V10.0252C18.3291 10.7781 18.1376 11.5289 17.7587 12.0906C15.8084 14.9909 13.0062 16.6666 9.9999 16.6666L9.71833 16.6618C6.81918 16.5605 4.13031 14.9001 2.24111 12.0906C1.52264 11.0256 1.47799 9.28052 2.10684 8.13068L2.24111 7.90932C4.19133 5.00909 6.99368 3.33339 9.9999 3.33331L10.2815 3.3382ZM9.9999 4.58331C7.56975 4.58339 5.19908 5.8926 3.44635 8.36424L3.27871 8.60675L3.2779 8.60838C3.06555 8.92314 2.91657 9.42487 2.91657 9.99998C2.91657 10.5032 3.03072 10.9499 3.2014 11.2646L3.2779 11.3916L3.27871 11.3932L3.44635 11.6357C5.19908 14.1074 7.56975 15.4166 9.9999 15.4166C12.5084 15.4166 14.9535 14.0217 16.7211 11.3932L16.7219 11.3916L16.7984 11.2646C16.9691 10.9499 17.0832 10.5032 17.0832 9.99998C17.0832 9.42481 16.9343 8.92313 16.7219 8.60838L16.7211 8.60675C14.9535 5.97826 12.5084 4.58331 9.9999 4.58331Z" fill="#757B86"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1538 7.02065C11.732 7.10052 12.9834 8.40167 12.9834 9.99998L12.9794 10.1538C12.8995 11.7319 11.5983 12.9833 10 12.9834L9.84623 12.9793C8.31894 12.9021 7.09798 11.6811 7.02071 10.1538L7.01664 9.99998C7.01666 8.35003 8.35009 7.01658 10 7.01658L10.1538 7.02065ZM10 8.26658C9.04043 8.26658 8.26666 9.04037 8.26664 9.99998C8.26668 10.9596 9.04044 11.7334 10 11.7334C10.9596 11.7333 11.7334 10.9595 11.7334 9.99998C11.7334 9.04042 10.9596 8.26665 10 8.26658Z" fill="#757B86"/>
      `;
    }
    passwordInput.focus();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    FormValidator.clearAllErrors(loginForm);

    let hasError = false;

    if (!username) {
      FormValidator.showError(usernameInput, "Vui lòng nhập tên đăng nhập");
      hasError = true;
    }

    if (!password) {
      FormValidator.showError(passwordInput, "Vui lòng nhập mật khẩu");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    showLoading(loginBtn);

    if (username === "admin" && password === "admin123") {
      hideLoading(loginBtn);

      Storage.set("user", {
        username: username,
        loginTime: new Date().toISOString(),
      });

      Navigation.goTo("../address-mac/index.html");
    } else {
      hideLoading(loginBtn);
      showToast("Tên đăng nhập hoặc mật khẩu không đúng", "error");
      FormValidator.showError(
        passwordInput,
        "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    }
  });

  usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      loginForm.dispatchEvent(new Event("submit"));
    }
  });

  usernameInput.focus();

  const user = Storage.get("user");
  if (user) {
  }
});
