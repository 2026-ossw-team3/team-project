import Button from "./Button";
import {
  formStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";

function QueueCreateForm({
  nickname,
  partySize,
  onNicknameChange,
  onPartySizeChange,
  onSubmit,
  isSubmitting = false,
}) {
  return (
    <div className={`p-6 ${surfaceStyles.card}`}>
      <div>
        <p className={textStyles.accent}>Queue request</p>
        <h2 className={`${textStyles.sectionTitle} mt-2`}>발급 정보 입력</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          대기 상태 확인에 사용할 닉네임과 방문 인원 수를 입력해주세요.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <label className={formStyles.label}>
          <span className={formStyles.labelText}>닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            placeholder="예: 가나다"
            className={formStyles.input}
            disabled={isSubmitting}
          />
        </label>

        <label className={formStyles.label}>
          <span className={formStyles.labelText}>인원 수</span>
          <input
            type="number"
            min="1"
            max="10"
            value={partySize}
            onChange={(event) => onPartySizeChange(event.target.value)}
            className={formStyles.input}
            disabled={isSubmitting}
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            1명 이상 10명 이하까지 입력할 수 있습니다.
          </p>
        </label>

        <Button
          type="submit"
          variant="primaryLg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "대기표 발급 중..." : "대기표 발급하기"}
        </Button>
      </form>
    </div>
  );
}

export default QueueCreateForm;