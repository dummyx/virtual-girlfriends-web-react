import { List } from "semantic-ui-react";

type Props = {
  onClick: CallableFunction;
  fileUrl: string;
  fileName: string;
};

export function ListItem({ onClick, fileUrl, fileName }: Props) {
  return (
    <>
      <List.Item
        onClick={() => {
          onClick(fileUrl);
        }}
      >
        <List.Icon name="file" size="large" verticalAlign="middle" />
        <List.Content>
          <List.Header as="a">{fileName}</List.Header>
        </List.Content>
      </List.Item>
    </>
  );
}
