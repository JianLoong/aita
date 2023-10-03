export default function Footer() {
  return (
    <div>
      <footer className="footer footer-center p-2">
        <div className="">
          <span className="text-muted">
            Project can be found{" "}
            <a className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://github.com/JianLoong/reddit-store">here</a> . This
            website updates itself every 6 hours on data from Reddit
          </span>
        </div>
      </footer>
    </div>
  );
}
