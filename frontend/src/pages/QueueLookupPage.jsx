import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import PageHero from "../components/PageHero";
import {
  formStyles,
  layoutStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";

function QueueLookupPage() {
  const navigate = useNavigate();

  const [queueId, setQueueId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQueueId = queueId.trim();
    const trimmedAccessCode = accessCode.trim();

    if (!trimmedQueueId) {
      alert("대기표 ID를 입력해주세요.");
      return;
    }

    if (!trimmedAccessCode) {
      alert("조회 코드를 입력해주세요.");
      return;
    }

    navigate(
      `/my-queue/${encodeURIComponent(
        trimmedQueueId
      )}?code=${encodeURIComponent(trimmedAccessCode)}`
    );
  }

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="Queue Lookup"
        title="대기표 조회"
        titleSize="sm"
        description="발급받은 대기표 ID와 조회 코드를 입력하면 현재 대기 상태를 확인할 수 있습니다."
        subDescription="대기번호, 앞 대기 팀 수, 예상 대기 시간, 호출 여부를 조회할 수 있습니다."
      >
        <section className={`mt-8 max-w-2xl ${surfaceStyles.sectionPanel}`}>
          <h2 className={textStyles.sectionTitle}>조회 정보 입력</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            대기표 발급 후 안내된 대기표 ID와 조회 코드를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <label className={formStyles.label}>
              <span className={formStyles.labelText}>대기표 ID</span>
              <input
                className={formStyles.input}
                value={queueId}
                onChange={(event) => setQueueId(event.target.value)}
                placeholder="예: 29"
                inputMode="numeric"
              />
            </label>

            <label className={formStyles.label}>
              <span className={formStyles.labelText}>조회 코드</span>
              <input
                className={formStyles.input}
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                placeholder="예: 3741C0"
                autoCapitalize="characters"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="primaryLg">
                대기 상태 조회하기
              </Button>

              <Button to="/" variant="secondaryLg">
                매장 목록으로 돌아가기
              </Button>
            </div>
          </form>
        </section>
      </PageHero>
    </main>
  );
}

export default QueueLookupPage;