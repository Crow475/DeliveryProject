document.getElementById("discountCode").addEventListener("click", function () {
    this.select();
});

document.getElementById("copyButton").addEventListener("click", function () {
    const discountCode = document.getElementById("discountCode");
    discountCode.select();
    document.execCommand("copy");
    document.getElementById("copyIcon").src = "/icons/check.svg";
    setTimeout(() => {
        document.getElementById("copyIcon").src = "/icons/copy.svg";
    }, 2000);
});
