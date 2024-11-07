import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function HelpRequestIndexPage() {
  // Stryker disable all : helprequest for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/helprequests/create">Create</a>
        </p>
        <p>
          <a href="/helprequests/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}