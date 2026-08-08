import json
from pathlib import Path

import pytest


CONTRACT_PATH = str(
    Path(__file__).resolve().parents[2] / "contracts" / "SkillProof.py"
)
CHARTER = (
    "Assess observable work quality, complexity, consistency, authorship signals, "
    "and alignment with the cited market standard. Popularity and self-description "
    "must never substitute for attributable evidence."
)


def deploy_protocol(direct_vm, direct_deploy, owner):
    direct_vm.sender = owner
    contract = direct_deploy(CONTRACT_PATH)
    contract.configure_protocol("SkillProof professional calibration", CHARTER)
    return contract


def register_alice(contract):
    contract.register_passport(
        "alice-passport",
        "Alice Morgan",
        "https://example.org/people/alice",
    )


def open_design_track(contract):
    contract.open_skill_track(
        "product-design",
        "Product design",
        "Senior product designer",
        "ADVANCED",
        "https://example.org/standards/product-design",
        "I design and validate complex digital product systems with research evidence.",
    )


def weave_two_samples(contract):
    contract.weave_work_sample(
        "product-design",
        "checkout-redesign",
        "Checkout redesign",
        "https://example.org/work/checkout",
        "PORTFOLIO",
        "interaction-design",
        "I led the interaction model and documented the decisions in the case study.",
    )
    contract.weave_work_sample(
        "product-design",
        "research-synthesis",
        "Research synthesis",
        "https://example.org/work/research",
        "ARTICLE",
        "user-research",
        "I conducted the interviews and authored the public synthesis.",
    )


def mock_sources(direct_vm):
    direct_vm.clear_mocks()
    direct_vm.mock_web(
        r".*example\.org.*",
        {
            "status": 200,
            "body": (
                "Public professional standard and attributable work evidence. "
                "The work demonstrates documented decisions, complexity, and outcomes."
            ),
        },
    )


def mock_verified_assessment(direct_vm):
    mock_sources(direct_vm)
    direct_vm.mock_llm(
        r".*independent professional skill assessor.*",
        json.dumps(
            {
                "credibility_score": 82,
                "evidence_coverage": 88,
                "rubric_digest": (
                    "The market standard emphasizes problem framing, interaction "
                    "quality, research practice, and accountable delivery."
                ),
                "capability_findings": [
                    {
                        "capability": "interaction-design",
                        "finding": "DEMONSTRATED",
                        "score": 84,
                        "reason": "The case study exposes the interaction decisions.",
                    },
                    {
                        "capability": "user-research",
                        "finding": "DEMONSTRATED",
                        "score": 79,
                        "reason": "The synthesis documents attributable research work.",
                    },
                ],
                "summary": "The frozen proof braid supports an advanced credibility level.",
            }
        ),
    )


def mock_neutral_assessment(direct_vm):
    mock_sources(direct_vm)
    direct_vm.mock_llm(
        r".*independent professional skill assessor.*",
        json.dumps(
            {
                "credibility_score": 28,
                "evidence_coverage": 32,
                "rubric_digest": "The standard requires broader attributable work.",
                "capability_findings": [
                    {
                        "capability": "interaction-design",
                        "finding": "EMERGING",
                        "score": 39,
                        "reason": "One source shows partial interaction work.",
                    },
                    {
                        "capability": "user-research",
                        "finding": "UNSUPPORTED",
                        "score": 10,
                        "reason": "The source does not establish the claimed research role.",
                    },
                ],
                "summary": "More evidence is required before a credential can be published.",
            }
        ),
    )


def prepare_frozen_track(contract):
    register_alice(contract)
    open_design_track(contract)
    weave_two_samples(contract)
    contract.freeze_proof_braid("product-design")


def test_protocol_configuration_is_curator_only(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    direct_vm.sender = direct_alice
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = direct_bob
    with pytest.raises(Exception):
        contract.configure_protocol("Unauthorized protocol", CHARTER)
    direct_vm.sender = direct_alice
    contract.configure_protocol("SkillProof protocol", CHARTER)
    assert contract.get_protocol_config()["configured"] is True


@pytest.mark.parametrize(
    "unsafe_url",
    [
        "http://example.org/profile",
        "https://localhost/profile",
        "https://127.0.0.1/profile",
        "https://10.0.0.1/profile",
        "https://192.168.1.2/profile",
    ],
)
def test_passport_requires_public_https(
    unsafe_url,
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    with pytest.raises(Exception):
        contract.register_passport("alice-passport", "Alice Morgan", unsafe_url)


def test_one_passport_per_account(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    register_alice(contract)
    with pytest.raises(Exception):
        contract.register_passport(
            "second-passport",
            "Alice Morgan",
            "https://example.org/people/alice-two",
        )


def test_only_passport_owner_controls_skill_track(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    register_alice(contract)
    open_design_track(contract)
    direct_vm.sender = direct_bob
    with pytest.raises(Exception):
        contract.weave_work_sample(
            "product-design",
            "foreign-sample",
            "Foreign sample",
            "https://example.org/work/foreign",
            "PORTFOLIO",
            "interaction-design",
            "The caller cannot attach work to another passport owner track.",
        )


def test_proof_braid_requires_distinct_samples_and_capabilities(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    register_alice(contract)
    open_design_track(contract)
    contract.weave_work_sample(
        "product-design",
        "checkout-redesign",
        "Checkout redesign",
        "https://example.org/work/checkout",
        "PORTFOLIO",
        "interaction-design",
        "I led the documented interaction model for this public case study.",
    )
    with pytest.raises(Exception):
        contract.freeze_proof_braid("product-design")


def test_triadic_braid_topology_and_replay_protection(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    register_alice(contract)
    open_design_track(contract)
    weave_two_samples(contract)
    with pytest.raises(Exception):
        contract.weave_work_sample(
            "product-design",
            "checkout-redesign",
            "Checkout redesign",
            "https://example.org/work/checkout",
            "PORTFOLIO",
            "interaction-design",
            "I led the interaction model and documented the decisions in the case study.",
        )
    braid = contract.get_proof_braid("product-design")
    assert braid["link_count"] == 2
    assert braid["capabilities"] == ["interaction-design", "user-research"]
    assert braid["links"][0]["track_id"] == "product-design"
    assert braid["links"][0]["sample_id"] == "checkout-redesign"
    assert braid["links"][0]["capability"] == "interaction-design"


def test_calibration_appends_publishable_generation(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    prepare_frozen_track(contract)
    mock_verified_assessment(direct_vm)
    contract.calibrate_skill("product-design")
    generation = contract.get_latest_assessment("product-design")
    assert generation["generation_id"] == "product-design-g1"
    assert generation["result"] == "VERIFIED"
    assert generation["level"] == "ADVANCED"
    assert generation["credibility_score"] == 82
    assert contract.get_skill_track("product-design")["state"] == "CHALLENGE_WINDOW"
    contract.publish_skill_credential("product-design")
    track = contract.get_skill_track("product-design")
    assert track["state"] == "PUBLISHED"
    assert track["published_generation_id"] == "product-design-g1"


def test_neutral_generation_can_extend_braid_but_cannot_publish(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    prepare_frozen_track(contract)
    mock_neutral_assessment(direct_vm)
    contract.calibrate_skill("product-design")
    generation = contract.get_latest_assessment("product-design")
    assert generation["result"] == "MORE_EVIDENCE_REQUIRED"
    assert generation["level"] == "UNASSESSED"
    with pytest.raises(Exception):
        contract.publish_skill_credential("product-design")
    contract.extend_proof_braid("product-design")
    assert contract.get_skill_track("product-design")["state"] == "COLLECTING_PROOF"


def test_challenge_recalibration_preserves_first_generation(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    prepare_frozen_track(contract)
    mock_verified_assessment(direct_vm)
    contract.calibrate_skill("product-design")
    first = contract.get_latest_assessment("product-design")

    direct_vm.sender = direct_bob
    contract.open_score_challenge(
        "product-design",
        "authorship-challenge",
        "https://example.org/challenges/authorship",
        "A public source disputes the claimed authorship of one portfolio sample.",
    )
    direct_vm.sender = direct_alice
    contract.answer_score_challenge(
        "authorship-challenge",
        "https://example.org/responses/authorship",
        "The response links the public contribution history and project credits.",
    )
    mock_verified_assessment(direct_vm)
    contract.recalibrate_skill("product-design")

    second = contract.get_latest_assessment("product-design")
    assert first["generation_id"] == "product-design-g1"
    assert second["generation_id"] == "product-design-g2"
    assert contract.get_assessment_generation("product-design-g1") == first
    challenge = contract.get_score_challenge("authorship-challenge")
    assert challenge["status"] == "RESOLVED"
    assert challenge["resolved_generation_id"] == "product-design-g2"


def test_owner_cannot_challenge_own_generation(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    prepare_frozen_track(contract)
    mock_verified_assessment(direct_vm)
    contract.calibrate_skill("product-design")
    with pytest.raises(Exception):
        contract.open_score_challenge(
            "product-design",
            "self-challenge",
            "https://example.org/challenges/self",
            "The owner must not be able to create a challenge against their own score.",
        )


def test_retirement_is_irreversible(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    prepare_frozen_track(contract)
    mock_verified_assessment(direct_vm)
    contract.calibrate_skill("product-design")
    contract.publish_skill_credential("product-design")
    contract.retire_skill_credential(
        "product-design",
        "The owner replaced this credential with a newer professional record.",
    )
    assert contract.get_skill_track("product-design")["state"] == "RETIRED"
    with pytest.raises(Exception):
        contract.publish_skill_credential("product-design")


def test_bootstrap_and_audit_expose_live_domain_state(
    direct_vm,
    direct_deploy,
    direct_alice,
):
    contract = deploy_protocol(direct_vm, direct_deploy, direct_alice)
    register_alice(contract)
    open_design_track(contract)
    bootstrap = contract.get_frontend_bootstrap()
    assert bootstrap["counts"]["passports"] == 1
    assert bootstrap["counts"]["tracks"] == 1
    assert bootstrap["recent_tracks"][0]["track_id"] == "product-design"
    audit = contract.get_audit_slice("product-design", 0, 20)
    assert [event["action"] for event in audit] == ["skill_track_opened"]
