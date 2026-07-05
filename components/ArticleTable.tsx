export default function ArticleTable() {

  return (

    <div className="rounded-3xl bg-white shadow-sm">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-5 text-left">

              Title

            </th>

            <th className="p-5 text-left">

              Category

            </th>

            <th className="p-5 text-left">

              Status

            </th>

            <th className="p-5 text-center">

              Actions

            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td className="p-5">

              No articles yet.

            </td>

            <td>-</td>

            <td>-</td>

            <td className="text-center">

              —

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}