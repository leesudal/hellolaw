import styled from '@emotion/styled';
import { FaRegTrashAlt } from 'react-icons/fa';
import { AQuestionType } from '@@types/custom';
import Button from '@components/Button/Button';
import GetCategoryIcon from '@utils/findIcon';
import { instance } from '@api/instance';

const QuestionTitleWrapper = styled.div`
  padding: 5px 0px 5px 0px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  flex: 1;
  position: relative;
`;

const QuestionTitle = styled.div`
  color: ${(props) => props.theme.black};
  text-align: left;
  font-size: 1.2rem;
  line-height: 1.2;
  font-weight: 700;
  position: relative;
  width: 188px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;

  display: -webkit-box;
  -webkit-line-clamp: 3; // 원하는 라인수
  -webkit-box-orient: vertical;
`;

const ButtonsWrapper = styled.div`
  padding: 10px 0px 10px 0px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
`;
const ContentContainer = styled.div`
  background: #ffffff;
  border-style: solid;
  border-color: ${(props) => props.theme.gray1};
  border-width: 0px 0px 2px 0px;
  padding: 12px 20px 12px 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex-shrink: 0;
  height: auto;
  max-height: 250px;
  position: relative;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 4px;
  width: auto !important;
  svg {
    color: ${(props) => props.theme.gray1};
  }

  &:hover {
    padding: 3px;
    transition: all 0.3s;
    background-color: ${(props) => props.theme.gray1};
    svg {
      color: white;
    }
    border-radius: 5px;
  }
`;
interface AccordionItemQProps {
  item: AQuestionType;
  onClick: () => void;
  onDelete: (id: number) => void;
}

const AccordionItemQ = ({ item, onClick, onDelete }: AccordionItemQProps) => {
  const { questionId, summary, lawType, category } = item;

  const handleDelete = async () => {
    onClick();
    instance.delete(`/api/question/v1?questionId=${questionId}`).then((res) => {
      if (res) {
        console.log('삭제 성공', res);
        onDelete(item.questionId);
      }
    });
  };

  const getDetailQuest = () => {
    instance.get(`/api/answer/detail?questionId=${questionId}`).then((res) => {
      if (res) {
        console.log('질문 상세 조회성공', res);
      }
    });
  };

  const lawTypeShort = (lawType: string) => {
    if (lawType.length > 14) return lawType.slice(0, 14) + '...';
    else return lawType;
  };
  return (
    <ContentContainer
      onClick={() => {
        getDetailQuest();
      }}
    >
      <QuestionTitleWrapper>
        <QuestionTitle>{summary}</QuestionTitle>
        <DeleteButton onClick={handleDelete}>
          <FaRegTrashAlt size={'14'} />
        </DeleteButton>
      </QuestionTitleWrapper>
      <ButtonsWrapper>
        <Button type="button" color="secondary3" custom="category">
          {lawTypeShort(lawType)}
        </Button>
        <Button type="button" color="secondary1" custom="category">
          {GetCategoryIcon(category)}
          {category}
        </Button>
      </ButtonsWrapper>
    </ContentContainer>
  );
};

export default AccordionItemQ;
